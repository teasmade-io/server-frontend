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
        this.setState({ pos: ii }, () => {
            (this.props.onChange || (() => {}))(this.state);
        });
    }

    button (c1, c2, index, contents = null) {
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

class MinuteTimer extends React.Component {
    constructor () {
        super();
        this.state = {};
        this.state.mins = 3;
        this.state.secs = 0;
    }

    updateTime (mins, secs) {
        mins = parseInt(mins)
        secs = parseInt(secs)

        if (secs < 0) {
            mins -= 1;
            secs += 60;
        } else if (secs >= 60) {
            mins += 1;
            secs -= 60;
        }

        console.log(mins, secs);

        if (mins < 0) {
            this.updateTime(0, 0);
        } else {
            this.setState({ mins, secs }, () => {
                (this.props.onChange || (() => {}))(this.state);
            });
        }
    }

    render () {
        return (
            <>
                <InputGroup className="pb-2">
                    <Form.Control type="number" value={this.state.mins} maximum={5}  minimum={0}
                                  className="border-0"
                                  onChange={e => this.updateTime(e.target.value, this.state.secs)}
                                  />
                    <InputGroup.Text className="border-0 rounded-0">mins</InputGroup.Text>
                    <Form.Control type="number" value={this.state.secs} maximum={60} minimum={0}
                                  className="border-0"
                                  style={{ width: "3ch" }}
                                  onChange={e => this.updateTime(this.state.mins, e.target.value)}
                                  />
                    <InputGroup.Text className="border-0 rounded-0">secs</InputGroup.Text>
                </InputGroup>
                <InputGroup className="pb-2 d-flex justify-content-center">
                    <Button variant="outline-primary mr-2" size="sm"
                            onClick={() => this.updateTime(this.state.mins + 1, this.state.secs)}
                            >
                        +1m
                    </Button>
                    <Button variant="outline-primary mr-2" size="sm"
                            onClick={() => this.updateTime(this.state.mins - 1, this.state.secs)}
                            >
                        -1m
                    </Button>
                    <Button variant="outline-primary mr-2" size="sm"
                            onClick={() => this.updateTime(this.state.mins, this.state.secs + 10)}
                            >
                        +10s
                    </Button>
                    <Button variant="outline-primary" size="sm"
                            onClick={() => this.updateTime(this.state.mins, this.state.secs - 10)}
                            >
                        -10s
                    </Button>
                </InputGroup>
            </>
        );
    }
}

class UIHome extends React.Component {
    constructor () {
        super();
        this.state = {};
        this.state.temp = 50;
        this.state.time = { secs: 0, mins: 10 }
        this.state.color = "#dba"
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
                    <h3>Notify Me When:</h3>
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
                        <h5 className="text-left">Timer reaches following time...</h5>
                        <MinuteTimer />
                        <h5 className="text-left">Tea reaches following color...</h5>
                        <ColorPicker startColor={[205,133,63]} endColor={[92,64,51]} />
                        <Button variant="primary" size="lg">
                            Brew a Cup!
                        </Button>
                    </Form>
                </Col>
                <Col>
                    <h3>Current Brew Stats:</h3>
                    <h5 className="text-left">Time Elapsed: {this.state.time.secs}:{this.state.time.mins}</h5>
                    <h5 className="text-left">Time Remaining: {this.state.time.secs}:{this.state.time.mins}</h5>
                    <h5 className="text-left">Temperature: {this.state.temp} °C</h5>
                    <div className="d-flex flex-row">
                        <h5 className="text-left mr-2 mb-0">Tea Color:</h5>
                        <div className="rounded flex-grow-1"
                             style={{ backgroundColor: this.state.color }}>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>;
    }
}

export default App;
