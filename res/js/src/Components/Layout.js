import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

const rowSource = {
    beginDrag(props) {
        return { id: props.id }
    },
    endDrag(props) {
        console.log(props)
    }
};

const rowTarget = {
    drop(props) {
        console.log(props)
    },
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

@DropTarget(props => props.type, rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))
@DragSource(props => props.type, rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))
export default class Layout extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDragPreview: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        isOver: PropTypes.bool.isRequired,
        type: PropTypes.string.isRequired,
        collapsed: PropTypes.bool.isRequired,
        position: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        moveRow: PropTypes.func.isRequired
    };

    render() {
        const {
            isDragging,
            isOver,
            connectDragSource,
            connectDragPreview,
            connectDropTarget,
            position,
            collapsed,
            label
        } = this.props;
        const opacity = isDragging ? .5 : isOver ? .2 : 1;
        return connectDragPreview(
            connectDropTarget(
                <div className={`layout${collapsed ? ' -collapsed' : ''}`} style={{opacity}}>
                    {connectDragSource(<div className="acf-fc-layout-handle" title={wp.i18n.__("Drag to reorder")}>
                        <span className="acf-fc-layout-order">{position}</span>
                        {label}
                    </div>)}
                    {this.props.children}
                </div>
            )
        )
    }
}
