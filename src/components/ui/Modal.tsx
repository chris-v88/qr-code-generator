import Button from './Button';
import Icon from './Icon';

export type ModalProps = {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

const Modal = (props: ModalProps) => {
  const { isOpen, children, title, onClose } = props;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen bg-gray-400 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <Icon name="X" size={20} />
        </Button>
        {title && <h1 className="text-xl font-semibold mb-4 pr-8">{title}</h1>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
