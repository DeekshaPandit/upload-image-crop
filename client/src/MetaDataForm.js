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
                <textarea className="form-control" rows="3" name="description" maxLength="50" value={metaData.description} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }}></textarea>
            </div>

            <div className="form-group">
                <label for="exampleFormControlInput1">Price</label>
                <input type="text" name="price" className="form-control" placeholder="Enter Price" onKeyPress={keyPress} value={metaData.price} onChange={(e) => { onInputChange(index, e.target.name, parseInt(e.target.value ? e.target.value : 0)) }} />
            </div>

            <div className="form-group">
                <label for="exampleFormControlInput1">Location</label>
                <input type="text" name="location" className="form-control" placeholder="Enter Location" value={metaData.location} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
            </div>

            <div className="form-group">
                <label for="exampleFormControlInput1">Breath</label>
                <input type="text" name="breath" className="form-control" placeholder="Enter Breath" onKeyPress={keyPress} value={metaData.breath} onChange={(e) => { onInputChange(index, e.target.name, parseInt(e.target.value ? e.target.value : 0)) }} />
            </div>
            <div className="d-flex flex-wrap align-items-center">
                <div className="col-8 pl-0 pr-3 form-group">
                    <label for="exampleFormControlInput1">Length</label>
                    <input type="text" name="length" className="form-control" placeholder="Enter Length" onKeyPress={keyPress} value={metaData.length} onChange={(e) => { onInputChange(index, e.target.name, parseInt(e.target.value ? e.target.value : 0)) }} />
                </div>
                <div className="col-4 p-0 form-group">
                    <label for="">Photo Privacy</label>
                    <select name="" className="form-control">
                        <option value="public">inch</option>
                        <option value="private">mm</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Width</label>
                <input type="text" name="width" className="form-control" placeholder="Enter Width" onKeyPress={keyPress} value={metaData.width} onChange={(e) => { onInputChange(index, e.target.name, parseInt(e.target.value ? e.target.value : 0)) }} />
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
                    <p>Add a 500px watermark to my photo when displayed..</p>
                </div>
            </div>
            <SuggestionTag tags={metaData.tags} addTag={(value) => { onInputChange(index, "tags", value) }} />
        </form>
    </div>
}
