import React, { useState } from 'react';
import {abs,max} from 'mathjs'
import 'katex/dist/katex.min.css';
import { InlineMath,BlockMath } from 'react-katex';
import Katex from 'katex/dist/katex.js';
import axios from 'axios';


import '../../App.css';

const jacobi = () => {
  const [solution,setsolution] = useState(null)
  const [matrixSize, setMatrixSize] = useState(3);
  const [err,seterr] = useState(0.000001);
  const [answer,setanswer] = useState();
  const [matrixB, setMatrixB] = useState(Array(matrixSize).fill(''));
  const [matrixA, setMatrixA] = useState(
      Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill('')));
  

  const error =(xold, xnew)=> Math.abs((xnew-xold)/xnew);
  const caljacobi=()=>{
      let iter = 0;
      let MAX = 100;
      let ans = new Array(matrixSize).fill(0);
      let newAns = new Array(matrixSize).fill(0);

      let A = matrixA.map((item)=>[...item]);
      let B = [...matrixB];

      let maxerr

      let obj=[];
      do{
          for(let i=0;i<matrixSize;i++){
              let sum = 0;
              for(let j=0;j<matrixSize;j++){
                  if(i!=j){
                      sum += A[i][j] * ans[j];
                  }
              }
              newAns[i] = (B[i] - sum)/A[i][i];
          }
          maxerr=0;
          for(let i=0;i<matrixSize;i++){
              const ea = error(ans[i], newAns[i]);
              maxerr = max(ea,maxerr);
          }
          console.log(maxerr)

          obj.push({i:iter,ans:ans,err:maxerr})

          ans = [...newAns];

          iter++;
      }while(iter<=MAX && maxerr>=err)

      console.log(obj)

      setanswer(obj)
  }

  const onMatrixAInput = (e, i, j) => {
      const newMatrixA = [...matrixA];
      newMatrixA[i][j] = e.target.value;
      setMatrixA(newMatrixA);
  };

  const onMatrixBInput = (e, i) => {
      const newMatrixB = [...matrixB];
      newMatrixB[i] = e.target.value;
      setMatrixB(newMatrixB);
  }

  const onErrInput = (e)=>{
    seterr(e.target.value)
  }

  const onClickReset = () => {
    setMatrixA(
      Array(matrixSize)
        .fill(null)
        .map(() => Array(matrixSize).fill(''))
    );
    setMatrixB(Array(matrixSize).fill(''));
  };

  const random = () => {
    axios.get(
      `${import.meta.env.VITE_API_URL}/load/linearalgebra/all`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(res => {
      setMatrixSize(res.data.data[0].matA.length)
      setMatrixA(res.data.data[0].matA)
      setMatrixB(res.data.data[0].matB)
    }).catch(err => {
      console.log('Error:', err.message);
    })
  }

  const onClickCalculate = () => {
    console.log("Matrix Size:", matrixSize);
    console.log("Matrix A:", matrixA);
    console.log("Matrix B:", matrixB,"Type of B:"+typeof(matrixB[0]));
    console.log(err)

    caljacobi();

    setsolution(printanswer());
  };


  const handleMatrixSizeChange = (e) => {
    const newSize = Number(e.target.value);
    let temp = []
    let differ = abs(newSize-matrixSize);
    matrixA.map((row,indexrow)=>{
      let temp2 = [...row]
      if(newSize < matrixSize){
        for(let i=0;i<differ;i++){
          temp2.pop()
        }
      }else{
        temp2 = temp2.concat(Array(differ).fill(''));
      }
      temp.push(temp2)
    })
    if(newSize > matrixSize){
      temp = temp.concat(
        Array(differ).fill(
          Array(newSize).fill('')))
    }else{
      for(let i=0;i<differ;i++){
        temp.pop();
      }
    }
    setMatrixA(temp);
    setMatrixSize(newSize);
    };
  const printanswer =()=>{
    return (
      <div className='flex flex-col'>
        <div className='flex-row mx-auto'>
          <table>
            <thead className='text-left'>
                <tr>
                  <th className='w-5'><InlineMath math="Iter"/></th>
                  <th><InlineMath math="x_k"/></th>
                  <th><InlineMath math="\varepsilon"/></th>
                </tr>
            </thead>
            <tbody className='mx-auto divide-y divide-slate-200'>
                {answer.map((element, index)=>{
                    return  (
                    <>
                      <tr key={index} className=' stroke-slate-300 text-left '>
                          <td className='p-3'>{element.i}</td>
                          <td className='flex flex-col p-3'>{element.ans.map((item,index)=>{return <InlineMath math={`x_${index} = ${item}`}/>})}</td>
                          <td className='p-3'>{element.err}</td>
                      </tr>
                    </>
                  )
                })}
              </tbody>
          </table>
        </div>
        
      </div>

    )
  }
return (
    <>
      <div className="flex items-end gap-2 mx-auto w-fit">
        <div className="flex flex-col">
          <label>Matrix size (NxN)</label>
          <input
            type="number"
            value={matrixSize}
            onChange={handleMatrixSizeChange}
            min="2"
            className="w-40 placeholder:text-gray-300 bg-white mt-2 border border-gray-300 p-2"
          />
        </div>
        <button
          className="bg-red-500 text-white p-2 rounded"
          onClick={onClickReset}
        >
          
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded mt-2"
          onClick={onClickCalculate}
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
      <div className='flex justify-center flex-col w-fit text-center mx-auto my-3'>
        <InlineMath math="\varepsilon"/> 
        <input 
          type="number"
          max="1"
          value={err}
          onChange={(e) => onErrInput(e)}
          className='w-40 placeholder:text-gray-300 bg-white mt-2 border border-gray-300 p-2'
        />
      </div>
      
      <div className='flex justify-center my-8 items-center gap-5'>
        <div className="flex-none items-center gap-2 mt-2">
          <div className="text-center">
            <InlineMath math="[A]" />
            <div
              className="grid auto-cols-auto gap-1 mt-2"
              style={{
                gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 5rem))`
              }}
            >
              {matrixA.map((row, rowIndex) =>
                row.map((_, colIndex) => (
                  <input
                    key={`matrix_a_${rowIndex}_${colIndex}`}
                    type="number"
                    value={matrixA[rowIndex][colIndex]}
                    onChange={(e) => onMatrixAInput(e, rowIndex, colIndex)}
                    className="h-20 w-20 text-center placeholder:text-gray-300 bg-white border rounded"
                    placeholder={`a${rowIndex + 1}${colIndex + 1}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className='felx-none item-center mt-2 gap-2'>
          <div className='text-center'>
              <InlineMath math="[x]"/>
              <div
              className="grid auto-rows-auto gap-1 mt-2"
              style={{
                gridTemplateRows: `repeat(${matrixSize}, minmax(0, 5rem))`
              }}
            >
              {Array.from({ length:matrixSize }).map((_,i) => (
                <input
                className="h-20 w-20 text-center placeholder:text-gray-200 bg-grey border rounded"
                placeholder={`x${i+1}`}
                disabled={"Disable Inputs"}
              />
              ))}
            </div>
          </div>

        </div>

          <InlineMath math="="/>

        <div className='flex-none items-center gap-2 mt-2'>
          <div className="text-center">
          <InlineMath math="[B]"/>
            <div
              className="grid auto-rows-auto gap-1 mt-2"
              style={{
                gridTemplateRows: `repeat(${matrixSize}, minmax(0, 5rem))`
              }}
            >
              {Array.from({ length: matrixSize }).map((_, i) => (
                <input
                  key={`matrix_b_${i}`}
                  type="number"
                  value={matrixB[i]}
                  onChange={(e) => onMatrixBInput(e, i)}
                  className="h-20 w-20 text-center placeholder:text-gray-300 bg-white border rounded"
                  placeholder={`b${i+1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='card bg-base-100 shadow-xl w-auto min-h-56 flex flex-1'>
        {solution}
      </div>
      
    </>
  );
}
export default jacobi