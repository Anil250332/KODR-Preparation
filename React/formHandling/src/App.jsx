import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
// console.log(formData);

  let handleChange = (e) => {
    setFormData((prev) => {
      return {
        ...formData,
        [e.target.name]: e.target.value
      }
    });
  }

  return <> 
      <div className='flex flex-col justify-center bg-gray-100 items-center gap-4 h-screen'>
         <h1 className='text-3xl font-bold text-gray-700'>Form Handling</h1> 
        <form action="" onSubmit={ (e) => {
          e.preventDefault();
          console.log(formData)

        }} className='flex flex-col justify-center  border border-gray-300 p-5 rounded-xl bg-white  items-center gap-4'>
           <input  className='border border-gray-300 rounded py-2 px-4' name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
           <input className='border border-gray-300 rounded py-2 px-4' name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
           <input className='border border-gray-300 rounded py-2 px-4' name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />

        <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded'>Submit</button> 
        </form>

      </div>
  </>
 
}


export default App;
