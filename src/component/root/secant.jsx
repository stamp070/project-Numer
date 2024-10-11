import { useState } from 'react'
import '../../App.css'

import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs';
import Plot from 'react-plotly.js'


const secant=()=> {
    const [data, setData] = useState([]);
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("(x^3)-13");
    const [X0,setX0] = useState(0);
    const [X1,setX1] = useState(0);
    const [Xans,setXans] = useState(0);

    const [funcXY,setfuncXY] = useState([]);

    const print =()=>{
        return(
            <Container className='mr-5'>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">X</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.iteration}</td>
                                <td>{element.x.toPrecision(6)}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
            </Container>
           
        );
    }
    const calculatefunc =(x0,x1)=>{
        let fx1 = evaluate(Equation, { x : x1 });
        let fx0 = evaluate(Equation, { x : x0 });
        
        return x1 - (fx1 * (x1-x0)) / (fx1 - fx0);
    }

    const error =(xold, xnew)=> Math.abs((xnew-xold)/xnew)*100;
    const Calsecant = (x0,x1 ,err) => {
        console.log(`x1: ${x1}, x0: ${x0}, Equation: ${Equation}`);
        let ea;
        let iter = 0;
        const MAX = 1000;
        const e = 0.00001;
        const newData = []; 

        let x = calculatefunc(x1,x0);
        
        do{
            iter++;
            
            newData.push({ iteration: iter, x: x,y: evaluate(Equation, { x: x }) });

            x = calculatefunc(x1,x0);

            ea = error(x,x1);

            x0 = x1;
            x1 = x;
            
        }while(ea > e && iter < MAX);
        
        setData(newData);
        setXans(x);
    };

    const inputEquation = (event) =>{
        setEquation(event.target.value)
    }

    const inputX0 = (event) =>{
        setX0(event.target.value)
    }
    const inputX1 = (event) =>{
        setX1(event.target.value)
    }

    const calculateRoot = () =>{
        const x0 = parseFloat(X0)
        const x1 = parseFloat(X1)
        Calsecant(x0,x1);
        initialFunc();
        
        setHtml(print());   
    }

    const initialFunc = () => {
        let data = [];
        const end = parseFloat(X0) + 10; 
    
        for (let i = parseFloat(X0); i <= end; i += 0.01) {
            data.push({ x: i, y: evaluate(Equation, { x: i }) });
        }
        
        setfuncXY(data); 
    };

    const plotOnePoint = {
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Secant',
        marker : {'color' : 'red'},
        line : {'color' : '#7695FF'}
    };

    const plotFx = {
        x: funcXY.map(item => item.x),
        y: funcXY.map(item => item.y),
        type: 'scatter',
        name: 'f(x)',
        mode: 'line',
        line : {'color' : '#72BF78'}
    }

    return(
        <Container>
                <Form >
                    <Form.Group className="mb-3">
                        <Form.Label>Input f(x)</Form.Label>
                            <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Initial X0</Form.Label>
                            <input type="number" id="X0" onChange={inputX0} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Initial X1</Form.Label>
                            <input type="number" id="X1" onChange={inputX1} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                        </Form.Group>
                    <Button variant="dark" onClick={calculateRoot}>
                        Calculate
                    </Button>
                </Form>
                <br></br>
                <h5>Answer = {Xans.toPrecision(7)}</h5>
                <Container>
            </Container>
            <Plot
                data={[plotOnePoint,plotFx]}
                layout={{ title: 'Secant Methods',dragmode: 'pan'}}
                style={{ width: "100%", height: "400px" }}
                config={{scrollZoom: true}}
                useResizeHandler={true}
            />
            <div class="flex justify-center">
                {html}
            </div>
            </Container>
    );
};
export default secant;