import React from 'react';
import { InputGroup, Button, Form, Container, Row, Col, Navbar } from 'react-bootstrap'
import logo from './logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ban from './ban.svg';
import colormap from 'colormap';

function App () {
    return (
        <div className="App">
            {/*/}
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p onClick={() => console.log("hey")}>
                    Hello there
                </p>
            </header>
            {/*/}
            <UIHome />
        </div>
    );
}

window.colormap = colormap;
class ColorPicker extends React.Component {
    constructor () {
        super();
        this.state = {};
        this.state.pos = -1;
    }

    setPos (ii) {
        this.setState({ pos: ii });
        (this.props.updatePos || (() => {}))(ii);
    }

    button (c1, c2, index, contents = null) {
        console.log(`linear-gradient(to right, ${c1}, ${c2})`);
        return (
            <Button key={index}
                    variant="outline-secondary"
                    active={index === this.state.pos}
                    className="border-0 rounded-0 p-1"
                    style={{ 'box-shadow': 'none' }}
                    size="sm"
                    onClick={() => this.setPos(index)}
                    >
                <div style={{ width: "40px", height: "40px", backgroundImage: `linear-gradient(to right, ${c1}, ${c2})` }}>
                    {contents}
                </div>
            </Button>
        );
    }

    render () {
        colormap = colormap({ colormap: [
                           { index: 0, rgb: this.props.startColor },
                           { index: 1, rgb: this.props.endColor }
                       ]
                       , nshades: 6
                       });

        colormap = colormap.map((x, i, a) => [a[i], a[i + 1]]).slice(0,-1);

        return (
            <InputGroup className="pb-2 d-flex justify-content-center">
                <span className="border rounded" style={{ overflow: "hidden" }}>
                {
                    this.button("#fff", "#fff", -1,
                        <>
                            <img src={ban} alt="No Color" width="20" height="20"/>
                            <span style={{ color: "black" }}>None</span>
                        </>
                    )
                }
                {
                    colormap.map(([c1, c2], ii) => this.button(c1, c2, ii))
                }
                </span>
            </InputGroup>
        );
    }
}

class UIHome extends React.Component {
    constructor () {
        super();
        this.state = {};
        this.state.myTitle = "TITLE";
    }

    render () {
        return <Container className="ui">
            <Navbar>
                <Navbar.Brand href="#home">
                    <img src={logo} className="d-inline-block align-top" alt="" style={{ paddingRight: 10, height: "30px", }} />
                    IoTea
                </Navbar.Brand>
            </Navbar>
            <Row>
                <Col>
                    <h3>Brew Settings</h3>
                    <Form>
                        {/*/}
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Preset:
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control as="select" className="text-center">
                                    <option>&lt;Default&gt;</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        {/*/}
                        <h5 className="text-left">Brewing Time</h5>
                        <InputGroup className="pb-2">
                            <Form.Control type="number" value={0} maximum={5}  minimum={0}
                                          className="border-0" />
                            <InputGroup.Text className="border-0 rounded-0">mins</InputGroup.Text>
                            <Form.Control type="number" value={0} maximum={60} minimum={0}
                                          className="border-0"
                                          style={{ width: "3ch" }} />
                            <InputGroup.Text className="border-0 rounded-0">secs</InputGroup.Text>
                        </InputGroup>
                        <InputGroup className="pb-2 d-flex justify-content-center">
                            <Button variant="outline-primary mr-2" size="sm">
                                +1m
                            </Button>
                            <Button variant="outline-primary" size="sm">
                                +10s
                            </Button>
                        </InputGroup>
                        <h5 className="text-left">Color Threshold</h5>
                        <ColorPicker startColor={[68,200,150]} endColor={[40,100,100]} />
                        <Button variant="primary" size="lg">
                            Brew a Cuppa
                        </Button>
                    </Form>
                </Col>
                <Col>
                    <h3>Lifetime Statistics</h3>
                </Col>
            </Row>
        </Container>;
    }
}

export default App;
