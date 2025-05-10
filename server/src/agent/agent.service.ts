import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent, AgentDocument } from './schemas/agent.schema';
import { CreateAgentDto } from './dto/create-agent.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    const createdAgent = new this.agentModel(createAgentDto);
    return createdAgent.save();
  }

  async findAll(): Promise<Agent[]> {
    return this.agentModel.find().exec();
  }

  async findByWallet(walletAddress: string): Promise<Agent[]> {
    return this.agentModel.find({ walletAddress }).exec();
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentModel.findById(id).exec();
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async update(
    id: string,
    updateAgentDto: Partial<CreateAgentDto>,
  ): Promise<Agent> {
    const updatedAgent = await this.agentModel
      .findByIdAndUpdate(id, updateAgentDto, { new: true })
      .exec();

    if (!updatedAgent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    return updatedAgent;
  }

  async remove(id: string): Promise<Agent> {
    const deletedAgent = await this.agentModel.findByIdAndDelete(id).exec();

    if (!deletedAgent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    return deletedAgent;
  }
}
