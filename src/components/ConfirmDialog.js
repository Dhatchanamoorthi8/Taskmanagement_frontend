'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function ConfirmDialog ({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  onClose,
  onConfirm,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className='py-2 text-sm text-muted-foreground'>{description}</div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={
              'bg-red-600 text-white hover:text-black hover:bg-red-600'
            }
          >
            {isLoading ? 'Deleting...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
