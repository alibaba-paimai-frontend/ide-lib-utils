import * as React from 'react';
import { render } from 'react-dom';
import { LibUtils, ILibUtilsProps } from '../src/';

function onClick(value) {
  console.log('当前点击：', value);
}

const props: ILibUtilsProps = {
  visible: true
}

render(<LibUtils {...props} onClick={onClick} />, document.getElementById(
  'example'
) as HTMLElement);