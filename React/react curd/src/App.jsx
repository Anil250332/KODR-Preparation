import React, { useState } from "react";
import Navbar from "./components/Navbar";
import UserCard from "./components/UserCard";
import Form from "./components/Form";

const App = () => {
  const [toggle, setToggle] = useState(false);
  const [usersData, setUsersData] = useState(() => {
    const saved = localStorage.getItem("usersData");
    return saved ? JSON.parse(saved) : [];
  });
  const [isEdit, setIsEdit] = useState(null);

    localStorage.setItem("usersData", JSON.stringify(usersData));

  const handleEdit = (user) => {
    setIsEdit(user);
    setToggle(true);
  };

  let handleDelete = (id) => {
    // let arr = usersData.filter((val) => val.id !== id);
    // setUsersData(arr);

    setUsersData((prev) => prev.filter((val) => val.id !== id));
  };

  return (
    <div className="h-screen bg-black flex flex-col gap-4">
      <Navbar setToggle={setToggle} toggle={toggle} setIsEdit={setIsEdit} />

      {toggle ? (
        <Form
          setUsersData={setUsersData}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setToggle={setToggle}
        />
      ) : (
        <div className="h-full p-4 flex gap-4">
          {usersData.map((val) => (
            <UserCard
              key={val.id}
              user={val}
              setIsEdit={setIsEdit}
              setToggle={setToggle}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
