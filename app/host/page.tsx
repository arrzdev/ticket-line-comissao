"use client";
import { useState } from "react";
import { QrReader } from 'react-qr-reader';



const Host = () => {
  const [data, setData] = useState('No result');
  
  return (
    <div className="zmin-h-screen bg-base-200 text-left p-8">
      <h1 className="text-4xl font-bold">Gestão da bilheteira</h1>
      <div className="pt-6 space-y-2">
        <button className="btn btn-outline w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          Fechar bilheteira
        </button>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn btn-outline w-full" onClick={() => document.getElementById('my_modal_2').showModal()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="gray" viewBox="0 0 448 512" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z" /></svg>
          Ler Bilhete
        </button>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box h-min text-center">
            <h3 className="font-bold text-lg">Validar bilhete</h3>
            <QrReader
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
              style={{ width: '100%' }}
            />
            <p>Bilhete: {data}</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
      <h1 className="text-4xl font-bold pt-20">Adicionar Pagamento</h1>
      <div className="pt-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Número de telefone</span>
          </label>
          <input placeholder="960123123" maxLength={9} className="input input-bordered w-full max-w-xs" />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Hora da transferencia</span>
          </label>
          <input type="text" maxLength={5} placeholder="00:00" className="input input-bordered w-full max-w-xs" />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Valor</span>
          </label>
          <input type="text" placeholder="3.5" className="input input-bordered w-full max-w-xs" />
        </div>
        <div className="pt-4">
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Adicionar
          </button>
        </div>
      </div>
      <h1 className="text-4xl font-bold pt-20">Lista de pagamentos</h1>
      <div className="overflow-x-auto p-1">
        <table className="table table-xs pt-1">
          <thead>
            <tr>
              <th></th>
              <th>Telefone</th>
              <th>Hora</th>
              <th>Quantidade</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>960123123</td>
              <td>22:45</td>
              <td>3</td>
              <td>9€</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>Telefone</th>
              <th>Hora</th>
              <th>Quantidade</th>
              <th>Valor</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default Host