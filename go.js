/**
 * Created by moyu on 2017/8/2.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {debug} from 'react-mhoc'
import MSlide from './'

const DebugMSlide = debug({infoDown: true})(MSlide)

ReactDOM.render(
    <DebugMSlide
        visibleBlockNum={1}
        visibleBlockSize={2}
    >
        <div style={
            {
                backgroundColor: 'red',
                width: 100,
                height: 100
            }
        }>Hello</div>
        <div style={
            {
                backgroundColor: 'orange'
            }
        }>World</div>
        <div style={{
            backgroundColor: 'yellow',
            width: 50,
            height: 80
        }}>Hello</div>
        <div style={{backgroundColor: 'green'}}>React</div>
        <div style={{backgroundColor: 'cyan'}}>MSlide</div>
    </DebugMSlide>,
    document.getElementById('root')
)