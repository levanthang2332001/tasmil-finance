import { BaseAction, ActionResult } from '../types/action.interface';
import { ParamsType } from '../../entities/intent.entity';

export abstract class AbstractBaseAction<
  TParams extends ParamsType = ParamsType,
> implements BaseAction<TParams>
{
  abstract readonly name: string;
  abstract readonly similar: string[];
  abstract readonly prompt: string;
  abstract readonly examples: string[];

  abstract handle(params: TParams): Promise<ActionResult> | ActionResult;
  abstract validateMissingParams(params: Partial<TParams>): string[];

  protected validateRequired(value: any, fieldName: string): string | null {
    if (value === undefined || value === null || value === '') {
      return fieldName;
    }
    return null;
  }

  protected validateNumber(value: any, fieldName: string): string | null {
    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
      return fieldName;
    }
    return null;
  }

  protected validateString(value: any, fieldName: string): string | null {
    if (typeof value !== 'string' || value.trim() === '') {
      return fieldName;
    }
    return null;
  }

  protected createSuccessResult<T>(data: T): ActionResult<T> {
    return {
      success: true,
      data,
    };
  }

  protected createErrorResult(error: string): ActionResult {
    return {
      success: false,
      error,
    };
  }

  validateParams?(params: TParams): boolean {
    const missingFields = this.validateMissingParams(params);
    return missingFields.length === 0;
  }
}
