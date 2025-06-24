/* eslint-disable @typescript-eslint/require-await */
import { ChatResponse } from 'src/chat/entities/chat.entity';
import { ParamsType } from '../../entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';

export class DefaultAction extends AbstractBaseAction<ParamsType> {
  readonly name = 'unknown';
  readonly similar: string[] = [];
  readonly prompt = `The user's intent could not be determined. Return an empty params object: {}`;

  readonly examples: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(_params: ParamsType): Promise<ChatResponse> {
    return this.createSuccessResult({
      message:
        'Sorry, I could not understand your request. Please try rephrasing or provide more specific details.',
      data: {},
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateMissingParams(_params: Partial<ParamsType>): string[] {
    // Unknown actions don't require specific parameters
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateParams(_params: ParamsType): boolean {
    // Unknown actions are always valid
    return true;
  }
}

export const defaultAction = new DefaultAction();
