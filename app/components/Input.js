import React, { Component } from 'react';
import styles from './Input.css';


export default class Input extends Component {

  setValue(value) {
    this.textInput.value = value;
  }

  change(e) {
    const { change } = this.props;
    change(this.props.type, this.textInput, e.target.value, e.key);
  }

  render() {
    return (
      <input
        onKeyPress={this.change.bind(this)}
        onChange={this.change.bind(this)}
        className={`${styles.input} ${this.props.className}`}
        type="text"
        ref={(input) => { this.textInput = input; }}
        value={this.props.color}
      />
    );
  }
}
