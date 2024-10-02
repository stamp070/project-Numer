import { useState } from 'react'
import '../../App.css'

import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs';
import Plot from 'react-plotly.js'


const graphical=()=> {
    const [data, setData] = useState([]);
    const [valueIter, setValueIter] = useState([]);
    const [valueXl, setValueXl] = useState([]);
    const [valueXm, setValueXm] = useState([]);
    const [valueXr, setValueXr] = useState([]);
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("(x^2)-13")
    const [X,setX] = useState(0)
    const [XL,setXL] = useState(0)
    const [XR,setXR] = useState(0)
    const [Y,setY] = useState(0)

    const print = () =>{
        console.log(data)
        setValueIter(data.map((x)=>x.iteration));
        setValueXl(data.map((x)=>x.Xl));
        setValueXm(data.map((x)=>x.Xm));
        setValueXr(data.map((x)=>x.Xr));
        return(
            <Container className='mr-5'>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">XL</th>
                            <th width="30%">XM</th>
                            <th width="30%">XR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.iteration}</td>
                                <td>{element.Xl}</td>
                                <td>{element.Xm}</td>
                                <td>{element.Xr}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
            </Container>
           
        );
    }

    const error =(xold, xnew)=> Math.abs((xnew-xold)/xnew)*100;
    const Calgraphical = (xl, xr ,err) => {
        let xm, fXm, fXr, ea;
        let iter = 0;
        const MAX = 50;
        const e = 0.00001;
        const newData = []; 

        
        setData(newData);
        setX(xm);
    };

    const inputEquation = (event) =>{
        setEquation(event.target.value)
    }

    const inputXL = (event) =>{
        setXL(event.target.value)
    }

    const inputXR = (event) =>{
        setXR(event.target.value)
    }
    const calculateRoot = () =>{
        const xlnum = parseFloat(XL)
        const xrnum = parseFloat(XR)
        Calgraphical(xlnum,xrnum);
        
        setHtml(print());   
    }
    const plotData = {
        x: data.map(item => item.Xm),
        y: data.map(item => item.y),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Xl',
        marker : {'color' : 'red'},
        line : {'color' : '#7695FF'}
    };
    return(
        <Container>
                <Form >
                    <Form.Group className="mb-3">
                        <Form.Label>Input f(x)</Form.Label>
                            <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Input XL</Form.Label>
                            <input type="number" id="XL" onChange={inputXL} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Input XR</Form.Label>
                            <input type="number" id="XR" onChange={inputXR} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                        </Form.Group>
                    <Button variant="dark" onClick={calculateRoot}>
                        Calculate
                    </Button>
                </Form>
                <br></br>
                <h5>Answer = {X.toPrecision(7)}</h5>
                <Container>
            </Container>
            <Plot
                data={[plotData]}
                layout={{ title: 'Graphical Methods'}}
                style={{ width: "100%", height: "400px" }}
            />
            <div class="flex justify-center">
                {print}
            </div>
            </Container>
    );
};
export default graphical;