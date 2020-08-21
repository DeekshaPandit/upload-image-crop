import SuggestionTag from './suggestion-tag';
import { getCategories } from './user';
import React, { Component, useState } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';


export function MetaDataForm({ index, metaData, onInputChange }) {
    return <div className="scrollable-panel">

        <form noValidate>
            <div className="form-group">
                <label for="exampleFormControlSelect1">Photo Privacy</label>
                <select name="privacy" className="form-control" onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }}>
                    <option value="public">Public Accessible everywhere, including on Profile</option>
                    <option value="moderate">Unlisted Accessible everywhere, except on Profile</option>
                    <option value="private">Limited access Only visible to you, unless added to a Gallery</option>
                </select>
            </div>
            <div className="form-group">
                <label for="exampleFormControlInput1">Title</label>
                <input type="text" name="title" className="form-control" placeholder="title" value={metaData.title} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
            </div>
            <div className="form-group">
                <label for="exampleFormControlTextarea1">Description</label>
                <textarea className="form-control" rows="3" name="description" value={metaData.description} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }}></textarea>
            </div>

            <div className="form-group">
                <label for="exampleFormControlInput1">Enter Location</label>
                <input type="text" className="form-control" placeholder="Enter Location" value={metaData.location} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label for="exampleFormControlInput1">Breath</label>
                    <input type="text" className="form-control" placeholder="Enter Breath" value={metaData.breath} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
                </div>
                <div className="form-group">
                    <label for="exampleFormControlInput1">Length</label>
                    <input type="text" className="form-control" placeholder="Enter Length" value={metaData.length} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
                </div>
                <div className="form-group">
                    <label for="exampleFormControlInput1">Width</label>
                    <input type="text" className="form-control" placeholder="Enter Width" value={metaData.width} onChange={(e) => { onInputChange(index, e.target.name, e.target.value) }} />
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
                    <p>Add a 500px watermark to my photo when displayed..</p>
                </div>
            </div>
            <SuggestionTag tags={metaData.tags} addTag={(value) => { onInputChange(index, "tag", value) }} />
        </form>
    </div>
}
