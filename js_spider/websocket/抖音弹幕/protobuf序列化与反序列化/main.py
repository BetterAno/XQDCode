from test_pb2 import Person, Message


"""序列化"""
# person = Person()
# person.name = '张三'
# person.age = 20
#
# person_info = person.SerializeToString()  # 序列化操作
# print('person_info:', person_info)

# message_info = Message()
# message_info.method = 'POST'
# message_info.payload = '你好'
# message_info = message_info.SerializeToString()
# print('message_info:', message_info)


"""反序列化"""
bytes_person = b'\n\x06\xe5\xbc\xa0\xe4\xb8\x89\x10\x14'
bytes_message = b'\n\x04POST\x12\x06\xe4\xbd\xa0\xe5\xa5\xbd'

person = Person()
person.ParseFromString(bytes_person)
print(person)
# print(person.name)
# print(person.age)

message = Message()
message.ParseFromString(bytes_message)
print(message)


"""
我们是基于test.proto中存在的模型来确定导入的类的

而不是生成的test_pd2.py
"""