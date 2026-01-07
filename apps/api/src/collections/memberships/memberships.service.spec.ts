import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Community } from '../communities/schemas/community.schema';
import { MembershipsService } from './memberships.service';
import { Membership } from './schemas/membership.schema';

const createMockModel = () => ({
  findById: vi.fn(),
  findOneAndUpdate: vi.fn(),
  find: vi.fn(),
});

describe('MembershipsService', () => {
  let service: MembershipsService;
  let membershipModel: ReturnType<typeof createMockModel>;
  let communityModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    membershipModel = createMockModel();
    communityModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        { provide: getModelToken(Membership.name), useValue: membershipModel },
        { provide: getModelToken(Community.name), useValue: communityModel },
      ],
    }).compile();

    service = module.get<MembershipsService>(MembershipsService);
  });

  it('should throw when community not found', async () => {
    communityModel.findById.mockResolvedValue(null);

    await expect(service.create({ communityId: 'missing' }, 'user')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw when community is paid', async () => {
    communityModel.findById.mockResolvedValue({ _id: '1', isFree: false });

    await expect(service.create({ communityId: 'paid' }, 'user')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should create membership for free community', async () => {
    communityModel.findById.mockResolvedValue({ _id: '1', isFree: true });
    membershipModel.findOneAndUpdate.mockResolvedValue({ _id: 'membership' });

    const result = await service.create({ communityId: 'free' }, 'user');

    expect(result).toEqual({ _id: 'membership' });
  });
});
