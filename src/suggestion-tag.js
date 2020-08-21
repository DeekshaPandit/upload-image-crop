import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';


function SuggestionTag({ tags, addTag }) {

    const addTags = (event) => {
        if ((event.key === "Enter" || event.key === "Space") && event.target.value != "") {
            addTag([...tags, event.target.value]);
            event.target.value = ""
        }
    }

    return (
        <div class="form-group">
            <label for="exampleFormControlInput1">Key Words</label>
            <div className="card">
                <div className="card-body">
                    <input className="form-control" type="text" onKeyUp={event => addTags(event)} placeholder="Press enter to add tags" />
                    <div className="tags-input">
                        <div className="d-flex flex-wrap">
                            {tags.map((tag, index) => (
                                <div key={index}>

                                    <button type="button" className="btn btn-outline-primary mr-2 mt-2" ><i className="fa fa-plus plus-thin"> </i>{tag}</button>
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
