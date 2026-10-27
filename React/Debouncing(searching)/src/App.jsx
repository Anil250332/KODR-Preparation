import axios from 'axios'
import React, { useEffect, useState } from 'react'

const App = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [filterProducts, setFilterProducts] = useState([]);

  let getProducts = async () => {
    setLoading(true);
    try {
      let res = await axios.get("https://fakestoreapi.com/products")
      setProducts(res.data)
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)

    }
  }


  let filterProduct = () => {
    let data = products.filter((val) => {
      return val.title.toLowerCase().includes(search.toLowerCase());
    });
    setFilterProducts(data);

  }

  useEffect(() => {
    getProducts();
  }, [])

  useEffect(() => {

    let tm = setTimeout(() => {
      console.log("hello");

      filterProduct();
    }, 500)
    return()=>{
      clearTimeout(tm);
    }
  }, [search])

  return (
    <div className='p-8'>
      <input type="text"
        className='mb-8 border-2'
        placeholder='product name'
        onChange={(e) => setSearch(e.target.value)}
      />
      {
        search ?
          filterProducts.map(val => {
            return <h1 key={val.id} className='text-gray-800'>{val.title}</h1>
          }) : products.map(val => {
            return <h1 key={val.id} className='text-gray-800'>{val.title}</h1>
          })
      }

    </div>
  )
}

export default App