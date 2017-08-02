/**
 * @file   index
 * @author yucong02
 */
import React, {Component, Children} from 'react'
import h from './helpers/react-helper'
import c from 'classname'
import suh from 'react-mhoc/lib/style-useable'
import style from './component.use.less'

@suh(style)
export default class extends Component {

    static defaultProps = {
        onPrev: (canPrev, visibleBlockNum, visibleBlockCount) => {
            console.log('prev')
            console.log('canPrev:', canPrev)
            console.log('visibleBlockNum:', visibleBlockNum)
            console.log('visibleBlockCount:', visibleBlockCount)
        },
        onNext: (canNext, visibleBlockNum, visibleBlockCount) => {
            console.log('next')
            console.log('canNext:', canNext)
            console.log('visibleBlockNum:', visibleBlockNum)
            console.log('visibleBlockCount:', visibleBlockCount)
        },

        visibleBlockSize: 1,
        visibleBlockNum: 1,

        justify: false,

        left: '<',
        right: '>',
        duration: '.5s',
        timingFunction: 'ease-in-out'
    }

    state = {
        visibleBlockNum: this.props.visibleBlockNum,
        visibleContainerStyle: {},
        allBlockStyle: {},
        commonSingleBlockStyle: {},
        // showSingle: false
    }

    renderBlock = (child, i) => {
        return (
            h.div({
                    className: 'block-item',
                    key: i,
                    ref: domNode => this['block' + i] = domNode,
                    style: this.state.commonSingleBlockStyle
                },
                child
            )
        )
    }

    updateSingleBlock = () => {

        // let selfDom = this.selfDom
        // let width = selfDom.clientWidth - 100

        if (!this.props.justify) return;

        let width = this.visibleContainer.clientWidth

        this.setState({
            commonSingleBlockStyle: {
                width: width / this.props.visibleBlockSize
            }
        }, () => {
            this.updateVisibleBlock()
            this.updateAllBlock()
            // this.setState({showSingle: true})
        })
    }

    componentWillReceiveProps(next) {
        if (next.visibleBlockNum !== this.state.visibleBlockNum) {
            this.setState({visibleBlockNum: next.visibleBlockNum})
        }
        if (next.children !== this.props.children) {
            this.updateSingleBlock()
            this.updateAllBlock()
        }

        if (next.children !== this.props.children
            || next.visibleBlockSize !== this.props.visibleBlockSize) {
            this.updateSingleBlock()
        }

    }

    componentDidUpdate(oldProps, oldState) {
        if (oldState.visibleBlockNum !== this.state.visibleBlockNum) {
            this.updateVisibleBlock()
        }
    }

    componentDidMount() {
        this.updateVisibleBlock()
        this.updateAllBlock()
        this.updateSingleBlock()
        window.addEventListener('resize', this.updateSingleBlock)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSingleBlock)
    }


    updateAllBlock(props = this.props) {
        const {
            visibleBlockSize,
        } = props
        let sumWidth = this.computeSumWidth(0, this.arrChildren.length - 1)
        if (sumWidth) {
            this.setState({allBlockStyle: {width: sumWidth}})
        }
    }

    computeSumWidth(from, to) {
        let sumWidth = 0
        for (let i = from; i <= to; i++) {
            let dom = this['block' + i]
            if (dom) {
                sumWidth += dom.clientWidth
            } else {
                sumWidth = 0
                break;
            }
        }
        return sumWidth
    }

    updateVisibleBlock() {
        const visibleBlockSize = this.props.visibleBlockSize
        const num = this.state.visibleBlockNum
        const index = (num - 1) * visibleBlockSize

        let sumWidth = 0
        let maxHeight = 0
        for (let i = index; i < visibleBlockSize + index; i++) {
            let dom = this['block' + i]
            if (dom) {
                sumWidth += dom.clientWidth
                if (maxHeight < dom.clientHeight) {
                    maxHeight = dom.clientHeight
                }
            } else {
                sumWidth = 0
                break;
            }
        }

        const passedWidth = this.computeSumWidth(0, index - 1)
        this.setState({
            allBlockStyle: {
                ...this.state.allBlockStyle,
                left: -passedWidth
            }
        })

        if (sumWidth) {
            this.setState({visibleContainerStyle: {width: sumWidth, height: maxHeight}})
        }
    }

    prev = e => {
        let visibleBlockNum = this.state.visibleBlockNum
        let {
            visibleBlockSize,
            onPrev,
        } = this.props
        let arrChildren = this.arrChildren

        let nextIndex = (visibleBlockNum - 2) * visibleBlockSize
        onPrev && onPrev(nextIndex >= 0, visibleBlockNum - 1, visibleBlockSize)
        if (nextIndex >= 0) {
            this.setState({visibleBlockNum: visibleBlockNum - 1})
        }
    }

    get arrChildren() {
        return Children.toArray(this.props.children) || []
    }

    next = e => {
        let visibleBlockNum = this.state.visibleBlockNum
        let {
            visibleBlockSize,
            onNext,
        } = this.props
        let arrChildren = this.arrChildren

        let nextIndex = visibleBlockNum * visibleBlockSize
        onNext && onNext(nextIndex < arrChildren.length, visibleBlockNum + 1, visibleBlockSize)
        if (nextIndex < arrChildren.length) {
            this.setState({visibleBlockNum: visibleBlockNum + 1})
        }
    }

    render() {

        return (
            h.div('slide-block-container', {
                    ref: r => this.selfDom = r,
                },
                h.div('slide-btn slide-perv', {
                    onClick: this.prev
                }, this.props.left),
                h.div('block-group', {
                        style: this.state.visibleContainerStyle,
                        ref: r => this.visibleContainer = r,
                    },
                    h.div('all-block-line', {
                            style: {
                                ...this.state.allBlockStyle,
                                transitionDuration: this.props.duration,
                                transitionTimingFunction: this.props.timingFunction,
                            }
                        },
                        this.arrChildren.map(this.renderBlock)
                    )
                ),
                h.div('slide-btn slide-next', {
                    onClick: this.next
                }, this.props.right)
            )
        )
    }
}