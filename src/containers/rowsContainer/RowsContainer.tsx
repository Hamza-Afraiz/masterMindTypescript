import React, { useState } from "react";
import { FourCirlce, SmallCircles, ColorsColumn } from "..";
import Modal from "react-modal";
import { Modal1 } from "../../components";
import {
  verticalColors,
  colorsObject,
  circles1,
  correctColorsObject,
} from "../../Constants/Constants";
import "./rowsContainer.scss";
import { stringify } from "querystring";
Modal.setAppElement("#root");
interface colorsObjectInterface {
  id:number;
  color:string;


}
interface colorsObjectInterfaces extends Array<colorsObjectInterface>{}
interface smallCirclesInterfaces extends Array<smallCirclesInterface>{}
interface smallCirclesInterface {
  id:number;
  type:string;
}
interface previousInterface {
  circlesPrevious:colorsObjectInterfaces;
  smallCirclesPrevious:smallCirclesInterfaces
}
var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var array2 = [...array];
var colorsCopy = colorsObject.map((a:colorsObjectInterface) => ({ ...a }));
console.log("colors copy is ",colorsCopy);

interface previousInterfaces extends Array<previousInterface>{}
function RowsContainer() {
  const [isOpen, setIsOpen] = useState(false); //checking end game condition to open modal

  const [columnColorNumber, setColumnColorNumber] = useState<colorsObjectInterface>(); //to check which column has been seleted to fill the color
  const [activeRow, setActiveRow] = useState<colorsObjectInterface[]>(colorsObject); //maintainig selected row of different colors
  const [gameState, setGameState] = useState(""); //to maintain game end state

  const [previousRow, setPreviousRow]= useState<previousInterfaces>([]); //maintaining the rows in which we have lost
  const [counterNext, setCounterNext] = useState(0); //to allow user to check and go on next row if user loose.

  //handling the tick button to check what going to be next/main
  const handleRow = () => {
    checkRow(correctColorsObject, activeRow);

    array.pop(); //user completed its one try.so oone index is decreasing

    //if users uses all his/her tries.
    if (array.length === 0) {
      setGameState("loss");
      toggleModal();
      setPreviousRow([]);
      restart();
    }
  };

  //when we are going to give the empty circle some color.

  const handleItem = (e: number) => {
    console.log("elelment number is ",e);
    if (columnColorNumber &&  columnColorNumber.id !== 0) {
      //if user didnt select any color

      let temp = [...activeRow];
      temp[e ] = columnColorNumber;
      setActiveRow(temp); //changing the row according to selected color
      setCounterNext(counterNext + 1);
    }
  };

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  //resetting the state of game
  const restart = () => {
    array = [...array2]; //objects are referenced based so keeping a copy for next game.

    var colorsCopy2 = colorsCopy.map((a: colorsObjectInterface) => ({ ...a }));
    setActiveRow(colorsCopy2);
  };

  //here is the logic to check that selected row of colors are equal to the demmanding row or not
  const checkRow = (original:{id:number;color:string}[], new1:{id:number;color:string}[]) => {
    let temp = circles1.map((a) => ({ ...a }));

    for (let i = 0; i < 4; i++) {
      console.log("color is ",new1[i].color);
      let exist = Object.values(original).includes(new1[i]); //checking if there is color or not.
      if (original[i].color === new1[i].color) {
        //checking both color and position

        temp[i].type = "full";
      } else if (exist) {
        temp[i].type = "small";
      } else {
        temp[i].type = "cross";
      }
    }

    //to check selected row result

    let counter = 0;

    //also  the game ending condition to check if all the inputs colors are correct
    for (let i = 0; i < 4; i++) {
      if (temp[i].type === "full") {
        counter += 1;
      }
    }

    //if user selected row is all the way correct
    if (counter === 4) {
      setGameState("congrats");
      toggleModal();
      setPreviousRow([]);
      restart();
      return;
    }

    //now if user hasnt selected the correct row then keeping track of previous results

    let circlesPrevious = new1; //big colored circles for previous
    let smallCirclesPrevious = temp; //small circles for previous
    let tempObj = {
      circlesPrevious,
      smallCirclesPrevious,
    };
    let temp2 = previousRow;
    temp2.push(tempObj);
    setPreviousRow(temp2);
    setActiveRow(colorsObject); //setting agian empty state for next row of game
    setCounterNext(0); //there is a new row so there is a new coounter
  };

  //method to handle child component called by a child component
  const handleColumnColor = (e:any) => {
    setColumnColorNumber(e);
  };

  return (
    <div className="rowsContainer">
      {/* game end state */}
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
      >
        {gameState === "loss" ? (
          <Modal1 onPress={toggleModal} type="loss" />
        ) : gameState === "congrats" ? (
          <Modal1 onPress={toggleModal} type="congrats" />
        ) : null}
      </Modal>

      {/* already attempted rows */}

      <div>
        {previousRow &&
          previousRow.map((item) => (
            <div className="previous">
              <FourCirlce  onPress={()=>{}} colorsObject={item.circlesPrevious} />

              <SmallCircles circles={item.smallCirclesPrevious} />
            </div>
          ))}

        {array.map((item) =>
          //  to check if we are on first index of array.we ll always be on first .because if we loose we are decreasing the array and mutating previous row

          1 === item ? (
            <div  className="active">
              <FourCirlce onPress={handleItem} colorsObject={activeRow} />
              {counterNext >= 4 ? (
                <div>
                  <img
                    className="image"
                    onClick={handleRow}
                    src="https://www.freepnglogos.com/uploads/tick-png/image-tick-mark-icon-png-good-luck-charlie-wiki-2.png"
                    alt="alternatetext"
                  />
                </div>
              ) : null}
              <SmallCircles circles={circles1} />
            </div>
          ) : (
            <div className="remaining">
              <FourCirlce onPress={handleItem} colorsObject={colorsObject} />
              <SmallCircles circles={circles1} />
            </div>
          )
        )}
      </div>
      {/* colors column to select and pasting on row */}
      <div>
        <ColorsColumn
          onPress={handleColumnColor}
          verticalColors={verticalColors}
        />
      </div>
    </div>
  );
}

export default RowsContainer;
