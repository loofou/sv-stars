export interface Node {
  id: string
  type: 'star' | 'planet' | 'orbit' | 'satellite'
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}

export interface StarNode extends Node {
  type: 'star'
  properties: {
    radius: number
  }
}