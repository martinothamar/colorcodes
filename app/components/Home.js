import React, { Component } from 'react';
import styles from './Home.css';
import Input from './Input.js';
import parse from 'parse-color';
import tinycolor from 'tinycolor2';

window.parse = parse;

export default class Home extends Component {
  constructor(props) {
    super(props);
    const colors = this.parse('rgba(0, 1, 127, .7)');
    const libColors = parse('rgba(0, 1, 127, .7)');
    this.required = Object.keys(colors);
    this.state = {
      colors,
      libColors,
      containerStyle: this.containerGradient('rgba', colors),
      buttonStyle: this.buttonStyle(colors)
    };
  }

  containerGradient(type, colors) {
    const c = this.fixInput(type, colors[type]);
    if (!c) {
      return this.defaultStyle;
    }
    const val = `linear-gradient(45deg, rgba(0,0,0,.8) 10%, ${c}`;
    return { backgroundImage: val };
  }
  defaultStyle = {
    backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.8) 10%, rgba(0, 1, 127, .7))'
  }

  buttonStyle(colors) {
    if (!colors.rgba) {
      return { backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' };
    }
    let color = this.fixInput('rgba', colors.rgba);
    const libColors = parse(color);
    libColors.rgba[3] = libColors.rgba[3] > 0 ? libColors.rgba[3] / 2 : 0.2;
    color = this.fixInput('rgba', libColors.rgba.join(', '));
    if (tinycolor(color).getLuminance() < 0.5) {
      return { color: '#fff', backgroundColor: color };
    }
    return { color: '#000', backgroundColor: color };
  }

  parse(value) {
    const parsed = parse(value);
    const keys = Object.keys(parsed);
    for (let i = 0; i < keys.length; i++) {
      const val = parsed[keys[i]];
      if (typeof val === 'string') {
        // Nothing
      } else if (Array.isArray(val)) {
        parsed[keys[i]] = val.join(', ');
      } else if (typeof val === 'undefined') {
        // Nothing
      } else {
        throw new Error('Invalid colors value');
      }
    }
    return parsed;
  }

  fixInput(type, value, key) {
    if (type !== 'hex' && type !== 'keyword') {
      return `${type}(${value})`;
    } else if (type === 'hex') {
      if (
        ((value[0] === '#' && value.length === 4) ||
        (value[0] !== '#' && value.length === 3)) &&
        key === 'Enter'
      ) {
        let newValue = '#';
        if (value[0] === '#')
          value = value.substring(1);
        for (let i = 0; i < value.length; i++) {
          newValue += value[i] + value[i];
        }
        return newValue;
      } else if (value[0] !== '#' && value.length === 6) {
        return '#' + value;
      }
    }
    return value;
  }

  regex = /^(?:(?:[0-9a-fA-F]{2}){3}|(?:[0-9a-fA-F]){3})$/

  change(type, input, value, key) {
    const required = {};
    this.required.forEach(k => (required[k] = ''));
    const fixedInput = this.fixInput(type, value, key);
    const parsed = this.parse(fixedInput);
    const libColors = parse(fixedInput);
    let colors = { ...required, ...parsed };

    const color = colors[type];

    if (
      (!color || (type === 'hex' && color !== fixedInput)) ||
      (type !== 'hex' && type !== 'keyword' && color !== value)
    ) {
      colors = this.invalidInput(colors, type, value);
      // console.log('Invalid, resetting', fixedInput, colors);
      this.setState({
        colors,
        containerStyle: this.defaultStyle,
        buttonStyle: this.buttonStyle(colors)
      });
    } else {
      // console.log('Valid, ', fixedInput, colors);
      this.setState({
        colors,
        libColors,
        containerStyle: this.containerGradient(type, colors),
        buttonStyle: this.buttonStyle(colors)
      });
    }
  }

  invalidInput(color, type, value) {
    const keys = Object.keys(color);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === type) {
        color[key] = value;
      } else {
        color[key] = '';
      }
    }
    return color;
  }

  inputs() {
    const keys = this.required;
    return keys.map(key => {
      const color = this.state.colors[key];
      return (
        <div key={key} className={styles.colorcontainer}>
          <div className={styles.label}>{key.toUpperCase()}</div>
          <Input className={styles.input} change={this.change.bind(this)} type={key} color={color || ''} />
          <button className={styles.button} style={this.state.buttonStyle} type="button">R</button>
          <button className={styles.button} style={this.state.buttonStyle} type="button">CSS</button>
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.container} style={this.state.containerStyle}>
        <div className={styles.innercontainer}>
          {this.inputs()}
        </div>
      </div>
    );
  }
}
