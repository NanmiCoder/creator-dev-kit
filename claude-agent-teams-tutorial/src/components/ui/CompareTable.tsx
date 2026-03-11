import type { ReactNode } from 'react'

interface Props {
  headers: string[]
  rows: (string | ReactNode)[][]
}

export default function CompareTable({ headers, rows }: Props) {
  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-bg-300/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-200">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-semibold text-text-100"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-bg-300/30 hover:bg-bg-200/50 transition-colors"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-text-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
