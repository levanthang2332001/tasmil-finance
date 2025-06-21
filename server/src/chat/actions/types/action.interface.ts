import { ParamsType } from '../../entities/intent.entity';

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BaseAction<TParams extends ParamsType = ParamsType> {
  readonly name: string;
  readonly similar: string[];
  readonly prompt: string;
  readonly examples: string[];

  handle(params: TParams): Promise<ActionResult> | ActionResult;
  validateMissingParams(params: Partial<TParams>): string[];
  validateParams?(params: TParams): boolean;
}

export type ActionMap = Record<string, BaseAction>;
