import PropTypes from 'prop-types';
import { Input } from "@material-tailwind/react";
import { useState } from 'react';
import { IoAdd } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const QuetityInput = ({single, custom, multiData, singleData}) => {

    const [todos, setTodos] = useState([{ name: "", label: "" }]); 
    const [singleValue, setSingleValue] = useState('');
  
    const handleTodoChange = (e, i) => { 
      const field = e.target.name; 
      const newTodos = [...todos]; 
      newTodos[i][field] = e.target.value; 
      setTodos(newTodos); 
      multiData(todos); 
    }; 

    const handleChangeInput = (e) => {
        setSingleValue(e.target.value);  
        singleData(singleValue);       
    }
    
    const handleAddTodo = () => {
      setTodos([...todos, { name: "", label: "" }]); 
    }; 
    
    const handleDeleteTodo = (i) => { 
      const newTodos = [...todos]; 
      newTodos.splice(i, 1); 
      setTodos(newTodos); 
    }; 
    
    const handleSubmit = (event) => {
      event.preventDefault(); 
      console.log(todos); 
      setTodos([{ name: "", label: "" }]); 
    }; 
    
    return(
        <div className='w-full'>
            <div className={`${single ? '' : 'hidden'}`}>
                <div>
                <Input size="md" label="จำนวนเอกสารที่ใส่ในแต่ล่ะชั้น" className="w-full" type="number" value={singleValue} onChange={handleChangeInput}/>
                </div>
            </div>
            <div className={`${custom ? '' : 'hidden'}`}>
                <div>
                {todos.map((todo, index) => ( 
                    <div key={index} className='flex gap-x-3 my-1 items-center'> 
                        <input 
                            className='px-2 py-1 w-full border border-gray-300 rounded-md focus:outline-red-500'
                            type="text"
                            placeholder="จำนวนเอกสารที่ใส่ในแต่ล่ะชั้น"
                            name="name"
                            value={todo.name} 
                            onChange={(e) => handleTodoChange(e, index)} 
                            required 
                        /> 
                        <button type='button' onClick={() => handleDeleteTodo(index)} className='h-[30px] w-[30px] flex justify-center items-center text-white text-[25px] bg-red-400 rounded-md hover:bg-red-500 duration-100 ease-in-out'><MdDelete /></button> 
                        <button type='button' onClick={handleAddTodo} className='h-[30px] w-[30px] flex justify-center items-center text-white text-[25px] bg-red-400 rounded-md hover:bg-red-500 duration-100 ease-in-out'><IoAdd /></button> 
                    </div> 
                ))}
                </div>
                <button onClick={handleSubmit}>save</button>
            </div>
        </div>
    );
};

QuetityInput.propTypes = {
    single: PropTypes.bool.isRequired,
    custom: PropTypes.bool.isRequired,
    singleData: PropTypes.any,
    multiData: PropTypes.any,
};

export default QuetityInput;