import { ModalSurface, type ModalProps } from "./ModalSurface";

export function Dialog(props: ModalProps) {
  return <ModalSurface {...props} placement="center" />;
}
export function Drawer(props: ModalProps) {
  return <ModalSurface {...props} placement="end" />;
}
