
import {ColorCircle} from '../../components';
import  './fourCircle.scss'

interface colorsObjectInterface {
    id:number;
    color:string;
  
  
  }
 
interface colorsObjectInterfaces extends Array<colorsObjectInterface>{}
type circleProps={
    colorsObject:colorsObjectInterfaces;
    onPress:(value:number)=>void;
}

const FourCirlce=(props:circleProps)=> {
    console.log('props is ',props)
    
 
    
   
  
 
 
    return (
        <div className='fourCircle'>
            {props.colorsObject.map((item,index)=>(
            <div onClick={()=>{props.onPress(index);
            }}>
            <ColorCircle  color={item.color}/>
            </div>  

            ))}
         
            
        </div>
    );
}
export default FourCirlce;

