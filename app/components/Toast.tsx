import React, { useEffect, useState } from 'react'

const SuccessToast = (message: string) => (
  <div className="alert alert-success">
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>Sucesso: {message}</span>
  </div>
)

const WarningToast = (message: string) => (
  <div className="alert alert-warning">
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    <span>Atenção: {message}</span>
  </div>
)

const ErrorToast = (message: string) => (
  <div className="alert alert-error">
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>Erro: {message}</span>
  </div>
)

const Toast = ({ actionFeedback }: { actionFeedback: { status: string, message?: string, data?: Object, redirect?: string, persist?: boolean } }) => {
  const [actionFeedbackState, setActionFeedback] = useState(actionFeedback);
  
  //clean action feedback after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (actionFeedbackState?.persist) return;
      setActionFeedback({ status: "" });
      if (actionFeedbackState?.redirect){
        window.location.href = actionFeedbackState.redirect;
      }

    }, 3000);

    return () => clearTimeout(timeout);
  }, [actionFeedbackState]);

  //when toast gets new props, update state
  useEffect(() => {
    setActionFeedback(actionFeedback);
  }, [actionFeedback]);
  
  return (
    <div className="mb-8">
      {actionFeedbackState.status === "success" && SuccessToast(actionFeedbackState.message || "")}
      {actionFeedbackState.status === "warning" && WarningToast(actionFeedbackState.message || "")}
      {actionFeedbackState.status === "error" && ErrorToast(actionFeedbackState.message || "")}
    </div>
  )
}

export default Toast