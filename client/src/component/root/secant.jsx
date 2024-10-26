import { useState } from 'react'
import '../../App.css'

import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate,max,min } from 'mathjs';
import Plot from 'react-plotly.js'
import axios from "axios"


const secant=()=> {
    const [data, setData] = useState([]);
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("(x^3)-13");
    const [X0,setX0] = useState(1);
    const [X1,setX1] = useState(5);
    const [Xans,setXans] = useState(0);
    const [Err,setErr] = useState(0.000001);

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
        err = parseFloat(err);
        let ea;
        let iter = 0;
        const MAX = 1000;
        const newData = []; 

        let x = calculatefunc(x1,x0);
        
        do{
            iter++;
            
            newData.push({ iteration: iter, x: x,y: evaluate(Equation, { x: x }) });

            x = calculatefunc(x1,x0);

            ea = error(x,x1);

            x0 = x1;
            x1 = x;
            
        }while(ea > err && iter < MAX);
        
        setData(newData);
        setXans(x);
        console.log(data);
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

    const inputErr = (event) =>{
        setErr(event.target.value)
    }

    const calculateRoot = () =>{
        const x0 = parseFloat(X0)
        const x1 = parseFloat(X1)
        
        Calsecant(x0,x1,Err);

        initialFunc();
        
        setHtml(print());   
    }

    const initialFunc = () => {
        let newdata = [];

        let Max = max(data.map((item)=>item.x));
        let Min = min(data.map((item)=>item.x));
    
        for (let i = Min-5; i <= Max+5; i += 0.01) {
            newdata.push({ x: i, y: evaluate(Equation, { x: i }) });
        }
        
        setfuncXY(newdata); 
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

    const random = () => {
        axios.get(
          `${import.meta.env.VITE_server_ip}:${import.meta.env.VITE_server_port}/load/rootequation/all`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        ).then(res => {
          const eq = res.data.equations[0].equation;
          setEquation(eq);
        })
    }

    return(
        <Container>
                <Form >
                    <Form.Group className="mb-3">
                        <Form.Label>Input f(x)</Form.Label>
                            <input type="text" id="equation" value={Equation} onChange={inputEquation} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Initial X0</Form.Label>
                            <input type="number" id="X0" value={X0} onChange={inputX0} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Initial X1</Form.Label>
                            <input type="number" id="X1" value={X1} onChange={inputX1} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Input Error</Form.Label>
                            <input type="number" id="Err" value={Err} onChange={inputErr} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                        </Form.Group>
                        <div class="flex justify-center">
                        <button
                            type="button"
                            onClick={calculateRoot}
                            class=" text-gray-900 bg-gray-100 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                        >
                            Calculate
                        </button>
                        <button
                            type="button"
                            onClick={() => random()}
                            class="ml-3 text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M440.88 129.37L288.16 40.62a64.14 64.14 0 0 0-64.33 0L71.12 129.37a4 4 0 0 0 0 6.9L254 243.85a4 4 0 0 0 4.06 0L440.9 136.27a4 4 0 0 0-.02-6.9M256 152c-13.25 0-24-7.16-24-16s10.75-16 24-16s24 7.16 24 16s-10.75 16-24 16m-18 118.81L54 163.48a4 4 0 0 0-6 3.46v173.92a48 48 0 0 0 23.84 41.39L234 479.48a4 4 0 0 0 6-3.46V274.27a4 4 0 0 0-2-3.46M96 368c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m96-32c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m266-172.49L274 271.56a4 4 0 0 0-2 3.45V476a4 4 0 0 0 6 3.46l162.15-97.23A48 48 0 0 0 464 340.86V167a4 4 0 0 0-6-3.49M320 424c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m0-88c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m96 32c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24m0-88c-8.84 0-16-10.75-16-24s7.16-24 16-24s16 10.75 16 24s-7.16 24-16 24"/></svg>
                      </button>
                    </div>
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