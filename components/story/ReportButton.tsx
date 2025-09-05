'use client'
import { useState, useTransition } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

const REASONS = ['harassment','self_harm','explicit','spam','other'] as const

export default function ReportButton({ targetType, targetId }: { targetType: 'story' | 'comment' | 'profile'; targetId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<typeof REASONS[number]>('spam')
  const [details, setDetails] = useState('')
  const [pending, start] = useTransition()
  function submit() {
    start(async () => {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_type: targetType, target_id: targetId, reason, details }),
      })
      setOpen(false)
    })
  }
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>Report</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Report">
        <div className="space-y-3">
          <div className="space-y-1">
            {REASONS.map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm">
                <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
                {r}
              </label>
            ))}
          </div>
          <textarea className="w-full rounded border border-outline p-2 text-sm" placeholder="Details (optional)" value={details} onChange={(e) => setDetails(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={pending}>Submit</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
