let React = require('react');

class _Message extends  React.Component {
    render(){
        console.log("render");
        return(
            <div>
                <h1>{this.props.title}</h1>
                <p>{this.props.message}</p>
            </div>);
    }
}
export const Message = _Message;
