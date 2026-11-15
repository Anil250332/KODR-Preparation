import { Component } from "../core/Component.ts";

class Button extends Component{
    render(): string {
        return `<button class="btn">Click Me</button>`;
    }   
    style(): string {
        return `.btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
        }`;
    }
}