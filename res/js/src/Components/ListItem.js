import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

const rowSource = {
    beginDrag(props) {
        return { id: props.id }
    }
};

const rowTarget = {
    hover(props, monitor, component) {
        let dragIndex = monitor.getItem().id;
        let hoverIndex = props.id;

        if (draggedIndex === hoverIndex) {
            return;
        }

        let hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        let hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        let clientOffset = monitor.getClientOffset();
        let hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }
        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().id = hoverIndex;
    }
};

@DragSource(props => props.type, rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
@DropTarget(props => props.type, rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))
export default class ListItem extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        isOver: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        key: PropTypes.any.isRequired,
        type: PropTypes.string.isRequired,
        moveRow: PropTypes.func.isRequired
    };
    render() {
        const {
            isDragging,
            isOver,
            connectDragSource,
            connectDropTarget
        } = this.props;
        const opacity = isDragging ? .5 : isOver ? .2 : 1;
        return connectDropTarget(
            connectDragSource(
                <li style={{opacity}}>
                    {this.props.children}
                </li>
            )
        )
    }
}
