import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {
  const [usdata, setUsdata] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setUsdata(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>App</h1>
      {usdata.map((item) => (
        <div key={item.id}>
          <h1>{item.title}</h1>
        </div>
      ))}
    </div>
  );
};

export default App;