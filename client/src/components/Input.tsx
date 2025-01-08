import { forwardRef, useId } from 'react'
import { Input } from './ui/input'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
  }

 const Inputt =  forwardRef<HTMLInputElement , InputProps>(({label , type , ...props}, ref) => {
    const id = useId()
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            {label && (
                <label htmlFor={id} className='text-sm font-medium'>{label}</label>
            )}
            <Input
                type={type}
                id={id}
                ref={ref}
                {...props}
            />
        </div>
    )
}
)


export default Inputt;