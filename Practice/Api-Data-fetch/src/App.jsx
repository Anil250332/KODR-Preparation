import axios from 'axios'
import React from 'react'

const App = () => {
   const [data, setData] = React.useState(null);
   let fetchData = async () => {
    let res = await axios.get("https://jsonplaceholder.typicode.com/posts")
    return res.data;
   }
   React.useEffect(() => {
     const getData = async () => {
       const result = await fetchData();
       setData(result);
     };
     getData();
   }, []);
   console.log(data)
  return (
    <div>
      {data?.map((item) => (
        <h2 key={item.id}>{item.title}</h2>
      ))}
    </div>
  )
}

export default App