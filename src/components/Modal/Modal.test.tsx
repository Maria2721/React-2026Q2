import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from './Modal';

function setup(props?: Partial<React.ComponentProps<typeof Modal>>) {
  const onClose = vi.fn();

  render(
    <Modal isOpen={true} onClose={onClose} title="Test modal" {...props}>
      <button>Inside button</button>
    </Modal>
  );

  return { onClose };
}

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test">
        Content
      </Modal>
    );

    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('renders in portal when open', () => {
    setup();

    expect(screen.getByText('Test modal')).toBeInTheDocument();
  });

  it('closes on overlay click', () => {
    const { onClose } = setup();

    fireEvent.click(document.querySelector('.bg-black\\/50')!);

    expect(onClose).toHaveBeenCalled();
  });

  it('closes on close button click', () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByLabelText('Close modal'));

    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when clicking inside modal content', () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByText('Inside button'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on ESC key', () => {
    const { onClose } = setup();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('focuses modal on open', async () => {
    setup();

    const modal = screen.getByRole('dialog');

    await waitFor(() => {
      expect(document.activeElement).toBe(modal);
    });
  });

  it('locks body scroll when open', () => {
    setup();

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('loops focus backward with Shift+Tab', async () => {
    setup();

    const modal = screen.getByRole('dialog');
    const button = screen.getByText('Inside button');

    modal.focus();
    button.focus();

    fireEvent.keyDown(window, {
      key: 'Tab',
      shiftKey: true,
    });

    expect(modal).toBeInTheDocument();
  });

  it('loops focus forward with Tab', async () => {
    setup();

    const button = screen.getByText('Inside button');
    button.focus();

    fireEvent.keyDown(window, {
      key: 'Tab',
      shiftKey: false,
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does nothing on ESC when modal is closed', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={false} onClose={onClose} title="Test">
        Content
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('handles modal with no focusable elements', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test">
        <div>no focusable elements</div>
      </Modal>
    );

    fireEvent.keyDown(window, {
      key: 'Tab',
      shiftKey: false,
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles overlay click safely', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test modal">
        <button>Inside button</button>
      </Modal>
    );

    const overlay = screen.getByTestId('modal-overlay');

    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
