const div = React.createElement("div",{id:root},[
    React.createElement("header",{},

        React.createElement("nav",{},[
            React.createElement("h1",{},"Hello World"),
            React.createElement("h2",{},"Hello World"),
            React.createElement("h3",{},"Hello World"),
        ]),
    ),
      React.createElement("header",{},

        React.createElement("main",{},[
            React.createElement("h1",{},"Hello World"),
            React.createElement("h2",{},"Hello World"),
            React.createElement("h3",{},"Hello World"),
        ]),
    ),
]);

    

const root = ReactDOM.createRoot(document.querySelector("main"));
root.render(div);