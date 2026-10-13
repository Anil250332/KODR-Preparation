import React, { useContext } from 'react'
import { StoreContext } from '../context/Store'

const Home = () => {
    const data = useContext(StoreContext);
    return (
        <div className=''>
            <h1>Home</h1>
            <p>{data}</p>
        </div>
    )
}

export default Home