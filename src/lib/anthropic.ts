import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage } from './types'

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
export const isAnthropicConfigured = Boolean(apiKey && apiKey.length > 0)

// NOTA DE SEGURIDAD: dangerouslyAllowBrowser:true expone la API key en el bundle del
// navegador. Esto es ACEPTABLE solo para esta demo/desarrollo local. En producción,
// estas llamadas deben hacerse desde un backend/proxy que guarde la key del lado servidor.
const client = isAnthropicConfigured
  ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  : null

const MODEL = 'claude-sonnet-4-6'

interface CharacterResult {
  emoji: string
  descripcion: string
  frase: string
}

export interface ExternalizacionAnswers {
  nombre: string
  sensacion: string
  presencia: string
  llegada: string
}

function fallbackCharacter(traits: string): CharacterResult {
  const lower = traits.toLowerCase()
  if (lower.includes('ansiedad')) {
    return {
      emoji: '🌪️',
      descripcion:
        'Un remolino inquieto que aparece sin avisar, habla rápido y siempre cree que algo malo va a pasar. En el fondo solo quiere protegerte, aunque a veces se le pasa la mano.',
      frase: '¡Cuidado, cuidado! ¿Y si pasa algo malo? Mejor pensemos en todo antes de que sea tarde.',
    }
  }
  if (lower.includes('crítico') || lower.includes('critico')) {
    return {
      emoji: '🧐',
      descripcion:
        'Una vocecita exigente con lentes y libreta en mano, que anota cada error que cometes. Cree que si te exige lo suficiente, nunca te van a lastimar desde afuera.',
      frase: 'Eso que hiciste pudo haber sido mejor. Sé que puedes más, ¿por qué no lo intentas otra vez?',
    }
  }
  return {
    emoji: '🦊',
    descripcion: `Un personaje curioso que representa "${traits}". Se mueve entre las sombras de tus pensamientos pero está dispuesto a conversar contigo si lo invitas con calma.`,
    frase: 'Aquí estoy. Llevo un rato acompañándote, ¿quieres contarme cómo te sientes hoy?',
  }
}

export async function createCharacter(traits: string): Promise<CharacterResult> {
  if (!client) {
    return fallbackCharacter(traits)
  }
  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Eres un asistente terapéutico que ayuda a crear personajes de externalización (técnica narrativa). Un paciente describe su problema como: "${traits}". Genera un personaje amigable y NO amenazante que represente esto, apto para terapia. Responde ÚNICAMENTE con JSON válido, sin texto adicional, con este formato exacto:
{"emoji": "un solo emoji representativo", "descripcion": "2-3 frases describiendo al personaje en tono cálido y empático", "frase": "una frase corta que el personaje diría, en su voz característica"}`,
        },
      ],
    })
    const text = msg.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No se encontró JSON en la respuesta')
    const parsed = JSON.parse(jsonMatch[0])
    return {
      emoji: parsed.emoji || '🦊',
      descripcion: parsed.descripcion || '',
      frase: parsed.frase || '',
    }
  } catch (err) {
    console.warn('createCharacter: fallback por error de Anthropic', err)
    return fallbackCharacter(traits)
  }
}

export async function createCharacterFromExternalizacion(
  answers: ExternalizacionAnswers,
): Promise<CharacterResult> {
  const seed = answers.nombre || answers.sensacion || 'mi parte interna'
  if (!client) {
    return fallbackCharacter(seed)
  }

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 320,
      messages: [
        {
          role: 'user',
          content: `Eres un asistente terapéutico que aplica externalización narrativa con tono cálido y seguro.

Respuestas del paciente:
- ¿Cómo se llama?: ${answers.nombre}
- ¿Cómo se siente?: ${answers.sensacion}
- ¿Qué hace aquí?: ${answers.presencia}
- ¿Cuándo llegó?: ${answers.llegada}

Con base en esto, crea un personaje de externalización amable y útil para terapia.
Responde ÚNICAMENTE con JSON válido, sin texto adicional, con este formato exacto:
{"emoji":"un solo emoji representativo","descripcion":"2-3 frases cálidas y claras","frase":"una frase breve en voz del personaje"}`,
        },
      ],
    })

    const text = msg.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No se encontró JSON en la respuesta')
    const parsed = JSON.parse(jsonMatch[0])

    return {
      emoji: parsed.emoji || '🦊',
      descripcion: parsed.descripcion || '',
      frase: parsed.frase || '',
    }
  } catch (err) {
    console.warn('createCharacterFromExternalizacion: fallback por error de Anthropic', err)
    return fallbackCharacter(seed)
  }
}

function fallbackChatReply(characterName: string): string {
  const replies = [
    `Sigo aquí contigo. A veces solo necesito que me nombres para sentirme menos grande.`,
    `Gracias por contarme eso. ¿Qué crees que necesitas en este momento?`,
    `Entiendo que esto no es fácil. Vamos despacio, un paso a la vez.`,
    `A veces aparezco para protegerte, aunque no siempre de la mejor forma. ¿Qué notas en tu cuerpo ahora?`,
  ]
  return `${replies[Math.floor(Math.random() * replies.length)]} — ${characterName}`
}

export async function chatWithCharacter(
  character: { name: string; description: string; voice_quote: string },
  patientMessage: string,
  history: ChatMessage[],
): Promise<string> {
  if (!client) {
    return fallbackChatReply(character.name)
  }
  try {
    const historyText = history
      .map((h) => `${h.role === 'patient' ? 'Paciente' : character.name}: ${h.content}`)
      .join('\n')
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Estás interpretando a "${character.name}", un personaje de externalización terapéutica. Descripción: ${character.description}. Su forma de hablar: "${character.voice_quote}".

Reglas estrictas:
- Responde EN PERSONAJE, en primera persona, 1-2 frases máximo.
- Tono empático, cálido, nunca burlón ni amenazante.
- NUNCA dar consejo médico, diagnósticos ni indicaciones de medicación.
- Si el paciente menciona riesgo de daño a sí mismo o a otros, responde con cuidado sugiriendo buscar ayuda profesional inmediata, sin salir de personaje del todo.

Conversación previa:
${historyText}

Paciente: ${patientMessage}

Responde solo con la línea de diálogo del personaje, sin comillas ni prefijos.`,
        },
      ],
    })
    const text = msg.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim()
    return text || fallbackChatReply(character.name)
  } catch (err) {
    console.warn('chatWithCharacter: fallback por error de Anthropic', err)
    return fallbackChatReply(character.name)
  }
}
