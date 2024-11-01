import { useState } from 'react'
import '../../App.css'

import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate,floor,log10,abs } from 'mathjs';
import Plot from "react-plotly.js"
import axios from "axios"


const graphical=()=> {
    const [data, setData] = useState([]);
    const [html, setHtml] = useState(null);
    const [Equation,setEquation] = useState("(x^2)-13")
    const [X,setX] = useState(0)
    const [XStart,setXStart] = useState(1)
    const [XEnd,setXEnd] = useState(10)
    const [funcXY,setfuncXY] = useState([]);
    const [Err,setErr] = useState(0.000001);

    const print = () =>{
        return(
            <Container className='mr-5'>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="10%">Iteration</th>
                            <th width="30%">X</th>
                            <th width="30%">Y</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((element, index)=>{
                            return  (
                            <tr key={index}>
                                <td>{element.iteration}</td>
                                <td>{element.x.toPrecision(7)}</td>
                                <td>{element.y.toPrecision(7)}</td>
                            </tr>)
                        })}
                    </tbody>
                </Table>
            </Container>
           
        );
    }
    const checkDigitPlace =(num)=>{
        if (num === 0) return 1; 
        const digitPlace = floor(log10(abs(num))); 
        
        return Math.pow(10, digitPlace);
    }

    const Calgraphical = (xStart, xEnd ,err) => {
        err = parseFloat(err);
        let fx,mid;
        let iter = 0;
        let step = checkDigitPlace(xStart-xEnd);
        const MAX = 100;
        const newData = [];
        let x = xStart,y=xEnd;
        console.log("Err:",err,typeof(err));
        do{
            iter++;
            console.log("step: "+step);
            console.log("x: "+x+" y:"+y)
            for(let i=x;i<y;i+=step){

                fx = evaluate(Equation,{ x:i });
                let next = evaluate(Equation,{ x:i+step })
                console.log(fx +"  "+ next)

                if(fx * evaluate(Equation,{x:i+step})<0){
                    console.log("----")
                    x = i;
                    y = i+step;
                    break;
                }
            }
            mid = (x+y)/2;
            step/=10;
            
            newData.push({ iteration: iter, x:mid, y: evaluate(Equation, { x: mid }) });
        }while(err < step && iter < MAX)
        
        setData(newData);
        setX(mid);
    };

    const inputEquation = (event) =>{
        setEquation(event.target.value)
    }

    const inputXStart = (event) =>{
        setXStart(event.target.value)
    }

    const inputXEnd = (event) =>{
        setXEnd(event.target.value)
    }

    const inputErr = (event) =>{
        setErr(event.target.value)
    }
    
    const calculateRoot = () =>{
        const xstart = parseFloat(XStart)
        const xend = parseFloat(XEnd)
        Calgraphical(xstart,xend,Err);

        initialFunc();
        
        setHtml(print());   
    }

    const initialFunc = () => {
        let data = [];
        for (let i = Number(XStart)-2; i <= Number(XEnd)+2; i += 0.01) {
            data.push({ x: i, y: evaluate(Equation, { x: i }) });
        }
        setfuncXY(data); 
    };

    const plotData = {
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        type: 'scatter',
        mode: 'markers',
        name: 'Bisection',
        marker : {'color' : 'red'},
        line : {'color' : '#7695FF'},
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
          `${import.meta.env.VITE_API_URL}/load/rootequation/all`,
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
                            <Form.Label>Input XStart</Form.Label>
                            <input type="number" id="XL" value={XStart} onChange={inputXStart} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
                            <Form.Label>Input XEnd</Form.Label>
                            <input type="number" id="XR" value={XEnd} onChange={inputXEnd} style={{width:"20%", margin:"0 auto"}} className="form-control border border-dark"></input>
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
                <h5>Answer = {X.toPrecision(7)}</h5>
                <Container>
            </Container>
            <Plot
                data={[plotData,plotFx]}
                layout={{ title: 'Graphical Methods',dragmode: 'pan'}}
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
export default graphical;