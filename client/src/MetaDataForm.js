import SuggestionTag from './suggestion-tag';
import { getCategories } from './user';
import React, { Component, useState } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';


export function MetaDataForm({ index, metaData, onInputChange }) {
    const keyPress = (evt) => {
        const charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    return <div className="scrollable-panel">
        <form noValidate>

            {index.length > 1 ? <div className="effect_wrapper"> <p><i className="fa fa-info-circle"></i>{`Changes made below will affect ${index.length} selected photos`} </p>   </div> : null}

            <div className="form-group">
                <label for="exampleFormControlSelect1">Photo Privacy</label>
                <select name="privacy" className="form-control" onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }}>
                    <option value="public">Public Accessible everywhere, including on Profile</option>
                    <option value="private">Limited access Only visible to you, unless added to a Gallery</option>
                </select>
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Title</label>
                <input type="text" name="title" className="form-control" placeholder="title" value={metaData.title} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
            </div>
            <div className="form-group">
                <label for="exampleFormControlTextarea1">Description</label>
                <textarea className="form-control" rows="3" placeholder="Describe in 50 characters" name="description" maxLength="50" value={metaData.description} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }}></textarea>
            </div>

            <div className="form-group">
                <label for="exampleFormControlInput1">Price</label>
                <input type="number" disabled={index.length > 1} step="0.01" min="0" name="price" className="form-control" placeholder="Enter Price" onKeyPress={keyPress} value={metaData.price} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
            </div>

            <div className="form-group">
                <label for="exampleFormControlInput1">Location</label>
                <input type="text" name="location" className="form-control" placeholder="Enter Location" value={metaData.location} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
            </div>

            <div className="col-12  p-0 form-group">
                <label for="exampleFormControlInput1">Breadth</label>
                <div className="flex-wrap align-items-center d-flex">
                    <div className="col-8 pr-3 pl-0">
                        <input type="text" disabled={index.length > 1} name="breadth" className="form-control" placeholder="Enter Breadth" onKeyPress={keyPress} value={metaData.breadth} onChange={(e) => { onInputChange(index, e.target.name, parseInt(e.target.value ? e.target.value : 0)) }} />
                    </div>
                    <div className="col-4 p-0">
                        <select disabled={true} name="" className="form-control">
                            <option value="inch">inch</option>
                            <option value="cm">cm</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="col-12  p-0 form-group">
                <label for="exampleFormControlInput1">Length</label>
                <div className="flex-wrap align-items-center d-flex">
                    <div className="col-8 pr-3 pl-0">
                        <input type="text" disabled={index.length > 1} name="length" className="form-control" placeholder="Enter Length" onKeyPress={keyPress} value={metaData.length} onChange={(e) => { onInputChange(index, e.target.name, parseInt(e.target.value ? e.target.value : 0)) }} />
                    </div>
                    <div className="col-4 p-0">
                        <select disabled={true} name="" className="form-control">
                            <option value="inch">inch</option>
                            <option value="cm">cm</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="col-12  p-0 form-group">
                <label for="exampleFormControlInput1">Width</label>
                <div className="flex-wrap align-items-center d-flex">
                    <div className="col-8 pr-3 pl-0">
                        <input type="text" disabled={index.length > 1} name="width" className="form-control" placeholder="Enter Width" onKeyPress={keyPress} value={metaData.width} onChange={(e) => { onInputChange(index, e.target.name, parseInt(e.target.value ? e.target.value : 0)) }} />
                    </div>
                    <div className="col-4 p-0">
                        <select disabled={true} name="" className="form-control">
                            <option value="inch">inch</option>
                            <option value="cm">cm</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="form-group">
                <label for="exampleFormControlSelect1">Category</label>
                <select name="category" className="form-control" onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }}>
                    {
                        getCategories().map((category) => {
                            return <option value={category.id}>{category.name}</option>
                        })
                    }

                </select>
            </div>
            <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customCheck1" name="nsfw" checked={metaData.nsfw} onChange={(e) => { onInputChange(index, e.target.name, e.target.checked) }}></input>
                    <label className="custom-control-label" for="customCheck1">NSFW content</label>
                    <p>This photo contains nudity, sexually explicit, or suggestive content.</p>
                </div>
            </div>
            <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customCheck2" name="watermark" checked={metaData.watermark} onChange={(e) => { onInputChange(index, e.target.name, e.target.checked) }}></input>
                    <label className="custom-control-label" for="customCheck2">Add watermark</label>
                    <p>Add watermark to my photo when displayed..</p>
                </div>
            </div>
            <SuggestionTag tags={metaData.tags} addTag={(value) => { onInputChange(index, "tags", value) }} />
        </form>
    </div>
}
