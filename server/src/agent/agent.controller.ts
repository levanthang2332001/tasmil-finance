import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { Agent } from './schemas/agent.schema';

@Controller('api/agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createAgentDto: CreateAgentDto,
  ): Promise<Agent> {
    console.log('createAgentDto', createAgentDto);
    return this.agentService.create(createAgentDto);
  }

  @Get()
  async findAll(@Query('wallet') walletAddress?: string): Promise<Agent[]> {
    if (walletAddress) {
      return this.agentService.findByWallet(walletAddress);
    }
    return this.agentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Agent> {
    return this.agentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ skipMissingProperties: true }))
    updateAgentDto: Partial<CreateAgentDto>,
  ): Promise<Agent> {
    return this.agentService.update(id, updateAgentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Agent> {
    return this.agentService.remove(id);
  }
}
