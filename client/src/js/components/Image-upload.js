import React, { Component } from "react";
import ReactDOM from "react-dom";

class Form extends Component {
  constructor() {
    super();

    this.state = {
      selectedFiles: []
    };
 
  }

  
  onSelectFile(e){
    if (e.target.files && e.target.files.length > 0) {
     
      e.target.files.forEach((file, index)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () =>
          this.setState({ src: reader.result })
        );
        reader.readAsDataURL(e.target.files[index]);
      })
     
    }
  };
 

  render() {
    return (
      <form>
        <div>
          <input type="file" accept="image/*" onChange={this.onSelectFile} multiple/>
        </div>
      </form>
    );
  }
}

export default Form;

const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<Form />, wrapper) : false;