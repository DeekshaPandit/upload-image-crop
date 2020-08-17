import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';


function SuggestionTag() {
    const [tags, setTags] = React.useState(['Hi', 'Hello', 'How Are You']);

    const addTags = (event)=>{
        if((event.key === "Enter" || event.key ==="Space") && event.target.value != "" ){
            setTags([...tags,event.target.value]);
            event.target.value=""
        }
    }

    return (
        <div class="tags-input">
            <label for="exampleFormControlInput1">Key Words</label>
            
            <div className="card">
                <div className ="card-body">
                <input
                        type="text"
                        onKeyUp={event => addTags(event)}
                        placeholder="Press enter to add tags"
            />
                <div className="tags-input">
                    <div className ="row">
                        
                        {tags.map((tag, index) => (
                            <div key={index}>
                               
                                <button  type="button" className="btn-multi btn btn-outline-primary" ><i className="fa fa-plus plus-thin"> </i>{tag}</button>
                            </div>
                        ))}
                        
                    </div>
                    
                </div>
                </div>
            </div>
        </div>
    );
}

export default SuggestionTag;
