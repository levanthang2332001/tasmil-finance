import Toolbar from '@/components/defi-agent/toolbar';
import React from 'react'

const AiAgentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <div className="flex flex-1 flex-col h-full overflow-y-auto">
        {children}
      </div>

      <Toolbar />
    </div>
  )
}

export default AiAgentLayout;
