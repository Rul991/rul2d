import { TypeAndValue } from '../../utils/types'
import IFont from '../IFont'
import ISimpleColor from '../simple/ISimpleColor'

export default interface JsonDrawableText {
    text?: TypeAndValue<'src' | 'text', string>
    font?: Partial<IFont>
}