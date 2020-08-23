import ReactDOM from 'react-dom';
import React, { Component, useState } from 'react';


function SuggestionTag({ tags, addTag }) {

    const addTags = (event) => {
        if ((event.key === "Enter" || event.key === "Space") && event.target.value != "") {
            if (!(tags.map(function (item) { return item.toLowerCase() }).indexOf(event.target.value.toLowerCase()) != -1)) {
                addTag([...tags, event.target.value]);
            }
            event.target.value = ""
        }
    }

    const removeTag = (index) => {
        let allTags = tags.filter((tag, i) => i != index);
        addTag(allTags)
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
                                    <button type="button" className="btn btn-outline-primary mr-2 mt-2" ><i className="fa fa-plus plus-thin"> </i>{tag}<i className="fa fa-times times-thin" onClick={event => removeTag(index)}> </i></button>
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
